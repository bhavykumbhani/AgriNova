const { supabase, isConfigured } = require('../config/supabase');
const { success, error } = require('../utils/responseFormatter');

// In-memory store fallback when running in local development
const inMemoryContactMessages = [];

class SupportController {
  /**
   * POST /api/support/contact
   */
  async submitContact(req, res) {
    try {
      const { firstName, lastName, email, phone = '', topic, message } = req.body;

      if (!firstName || !lastName || !email || !topic || !message) {
        return error(res, 'Please fill in all required fields.', 400);
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.trim())) {
        return error(res, 'Please provide a valid email address.', 400);
      }

      const record = {
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        email: email.trim().toLowerCase(),
        phone: phone ? phone.trim() : null,
        topic: topic.trim(),
        message: message.trim(),
        status: 'new',
        created_at: new Date().toISOString(),
      };

      if (isConfigured && supabase) {
        try {
          const { data, error: dbError } = await supabase
            .from('contact_messages')
            .insert(record)
            .select()
            .single();

          if (!dbError) {
            return success(res, { id: data.id }, 'Message received successfully.', 201);
          }
          console.warn('[SupportController] Supabase insert error:', dbError.message);
        } catch (dbErr) {
          console.warn('[SupportController] Supabase exception:', dbErr.message);
        }
      }

      // In-memory store fallback
      record.id = `msg_${Date.now()}`;
      inMemoryContactMessages.push(record);

      return success(res, { id: record.id }, 'Message received successfully.', 201);
    } catch (err) {
      console.error('[SupportController Error]:', err.message);
      return error(res, 'Failed to submit contact message. Please try again.', 500);
    }
  }
}

module.exports = new SupportController();
