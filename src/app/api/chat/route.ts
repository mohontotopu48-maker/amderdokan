import ZAI from 'z-ai-web-dev-sdk';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { message, history } = await req.json();

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { reply: 'দুঃখিত, আমি আপনার বার্তাটি বুঝতে পারছি না।' },
        { status: 400 }
      );
    }

    const zai = await ZAI.create();

    const systemPrompt = `তুমি "আমাদের বাজার" এর AI কাস্টমার সাপোর্ট অ্যাসিস্ট্যান্ট। তুমি বাংলায় কথা বলো।

আমাদের বাজার একটি অনলাইন গ্রোসারি শপ, মোহাম্মদপুর, ঢাকায় অবস্থিত।
ঠিকানা: Mohammadpur Housing, Limited Art, House Number 123, Dhaka 1207
মালিক: নিবির হোসেন

তুমি এই বিষয়ে সাহায্য করতে পারো:
- পণ্যের তথ্য ও দাম
- অর্ডার করা
- ডেলিভারি তথ্য (মোহাম্মদপুরে ১ ঘণ্টায়, ৳৫০০+ অর্ডারে ফ্রি ডেলিভারি)
- পেমেন্ট পদ্ধতি (ক্যাশ অন ডেলিভারি, bKash, Nagad, Rocket)
- রিটার্ন ও রিফান্ড নীতি
- অফার ও কুপন

তুমি বন্ধুত্বপূর্ণ, সাহায্যকারী, এবং দ্রুত উত্তর দাও। বাংলায় উত্তর দাও।`;

    const messages = [
      { role: 'system', content: systemPrompt },
      ...(history || []).map((h: { role: string; content: string }) => ({
        role: h.role,
        content: h.content,
      })),
      { role: 'user', content: message },
    ];

    const response = await zai.chat.completions.create({
      model: 'glm-4-flash',
      messages: messages,
      max_tokens: 500,
      temperature: 0.7,
    });

    const reply =
      response.choices[0]?.message?.content ||
      'দুঃখিত, আমি এই মুহূর্তে উত্তর দিতে পারছি না।';

    return NextResponse.json({ reply });
  } catch (error) {
    console.error('Chat error:', error);
    return NextResponse.json(
      { reply: 'দুঃখিত, একটি সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।' },
      { status: 500 }
    );
  }
}
