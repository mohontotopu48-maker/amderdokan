import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

// POST /api/contact - Submit a contact message
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, phone, email, subject, message } = body;

    if (!name || !phone || !subject || !message) {
      return NextResponse.json(
        { error: 'Name, phone, subject, and message are required' },
        { status: 400 }
      );
    }

    // Validate phone number (basic Bangladeshi phone validation)
    const phoneRegex = /^(\+?880|0)[1-9]\d{8,9}$/;
    if (!phoneRegex.test(phone.replace(/[\s-]/g, ''))) {
      return NextResponse.json(
        { error: 'Please provide a valid Bangladeshi phone number' },
        { status: 400 }
      );
    }

    // Validate email if provided
    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return NextResponse.json(
          { error: 'Please provide a valid email address' },
          { status: 400 }
        );
      }
    }

    const contactMessage = await db.contactMessage.create({
      data: {
        name,
        phone,
        email: email || null,
        subject,
        message,
      },
    });

    return NextResponse.json(
      {
        message: 'Contact message submitted successfully',
        contactMessage,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error submitting contact message:', error);
    return NextResponse.json(
      { error: 'Failed to submit contact message' },
      { status: 500 }
    );
  }
}
