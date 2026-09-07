'use server'

import { supabaseAdmin } from '@/lib/supabase'

export async function approveSubmissionServer(sub: any) {
  try {
    const extra = sub.extra_info || {}
    const targetId = extra.target_id

    if (sub.category === 'city') {
      const { error: cityErr } = await supabaseAdmin.from('cities').insert([
        {
          id: `city-${Date.now()}`,
          country: sub.country,
          name: sub.title,
          desc: sub.description || '',
        },
      ])
      if (cityErr) {
        console.error('Error inserting city:', cityErr)
        return { success: false, error: cityErr.message }
      }
    } else {
      const targetTable =
        sub.category === 'tocity'
          ? 'tocity'
          : sub.category === 'transport'
          ? 'transport'
          : sub.category + 's'

      let recordData: any = {
        city: sub.city,
        name: sub.title,
        desc: sub.description || '',
        link: sub.link || '',
      }

      if (sub.category === 'food') {
        recordData = {
          city: sub.city,
          name: sub.title,
          desc: sub.description || '',
          is_meat: Boolean(extra.isMeat),
          is_spicy: Boolean(extra.isSpicy),
          is_vegan: Boolean(extra.isVegan),
          is_vegetarian: Boolean(extra.isVegetarian),
        }
      } else if (sub.category === 'stay') {
        recordData = {
          city: sub.city,
          where_stay: sub.title,
          desc: sub.description || '',
          link: sub.link || '',
        }
      } else if (sub.category === 'tocity') {
        recordData = {
          city: sub.city,
          type: extra.arrivalType || 'plane',
          name: sub.title,
          desc: sub.description || '',
          link: sub.link || '',
          note: sub.description || '',
          note_link: extra.noteLink || '',
        }
      } else if (sub.category === 'transport') {
        recordData = {
          city: sub.city,
          card_name: extra.cardName || sub.title,
          card_fee: extra.cardFee || '',
          fare: extra.fare || '',
          where_to_buy: sub.description || '',
          taxi_app: extra.taxiApp || '',
          car_share_app: extra.carShareApp || '',
          car_rental: extra.carRental || '',
          mobile_app: extra.mobileApp || '',
          passes: Array.isArray(extra.passes) ? extra.passes : [],
          contactless: Boolean(extra.contactless),
          qr: Boolean(extra.qr),
        }
      } else if (sub.category === 'poi') {
        recordData = {
          city: sub.city,
          name: sub.title,
          desc: sub.description || '',
          link: sub.link || '',
        }
      } else if (sub.category === 'events') {
        recordData = {
          city: sub.city,
          name: sub.title,
          desc: sub.description || '',
          event_date: extra.eventDate || '',
          location: extra.location || '',
          price: extra.price || '',
          link: sub.link || '',
        }
      }

      let updated = false
      if (targetId) {
        // Check if record with targetId exists in Supabase table
        const { data: existing } = await supabaseAdmin
          .from(targetTable)
          .select('id')
          .eq('id', targetId)
          .limit(1)

        if (existing && existing.length > 0) {
          const { error: updateErr } = await supabaseAdmin
            .from(targetTable)
            .update(recordData)
            .eq('id', targetId)
          if (!updateErr) updated = true
        }
      }

      // If transport category and targetId didn't match, check by city name
      if (!updated && sub.category === 'transport') {
        const { data: existing } = await supabaseAdmin
          .from('transport')
          .select('id')
          .ilike('city', sub.city)
          .limit(1)

        if (existing && existing.length > 0) {
          const { error: updateErr } = await supabaseAdmin
            .from('transport')
            .update(recordData)
            .eq('id', existing[0].id)
          if (!updateErr) updated = true
        }
      }

      // If not updated (new entry or fallback Google Sheets item not in Supabase yet), insert it into Supabase!
      if (!updated) {
        const { error: insertErr } = await supabaseAdmin.from(targetTable).insert([
          { id: targetId || `user-${Date.now()}`, ...recordData },
        ])
        if (insertErr) {
          console.error(`Insert to ${targetTable} error:`, insertErr)
          return { success: false, error: insertErr.message }
        }
      }
    }

    // Mark submission as approved in Supabase submissions table
    const { error: subErr } = await supabaseAdmin
      .from('submissions')
      .update({ status: 'approved' })
      .eq('id', sub.id)

    if (subErr) {
      console.error('Error approving submission status:', subErr)
      return { success: false, error: subErr.message }
    }

    return { success: true }
  } catch (err: any) {
    console.error('Server Approve Error:', err)
    return { success: false, error: err.message || 'Approve failed' }
  }
}

export async function rejectSubmissionServer(id: string) {
  try {
    const { error } = await supabaseAdmin
      .from('submissions')
      .update({ status: 'rejected' })
      .eq('id', id)

    if (error) {
      console.error('Error rejecting submission status:', error)
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (err: any) {
    console.error('Server Reject Error:', err)
    return { success: false, error: err.message || 'Reject failed' }
  }
}
