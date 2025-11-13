import React, { useState } from 'react';

const ContactPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real application, you would handle form submission here (e.g., API call)
    console.log({ name, email, subject, message });
    setFormSubmitted(true);
  };

  return (
    <div>
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900">Get In Touch</h1>
        <p className="mt-3 text-lg text-gray-600 max-w-2xl mx-auto">We're here to help. Whether you have a question about our platform, need vendor support, or just want to say hello, we'd love to hear from you.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-12 bg-white p-8 rounded-xl shadow-2xl border border-gray-200">
        {/* Contact Form */}
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Send us a Message</h2>
          {formSubmitted ? (
             <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded-md h-full flex flex-col justify-center text-center">
                <p className="font-bold text-lg">Thank You!</p>
                <p>Your message has been sent successfully. We'll get back to you shortly.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input type="text" id="name" value={name} onChange={e => setName(e.target.value)} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input type="email" id="email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                <input type="text" id="subject" value={subject} onChange={e => setSubject(e.target.value)} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                <textarea id="message" value={message} onChange={e => setMessage(e.target.value)} required rows={5} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"></textarea>
              </div>
              <button type="submit" className="w-full bg-indigo-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                Submit
              </button>
            </form>
          )}
        </div>

        {/* Contact Info */}
        <div className="bg-gray-50 p-8 rounded-lg">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Contact Information</h2>
          <div className="space-y-6">
            <InfoItem icon={<LocationIcon />} title="Our Office" lines={["Noida, Uttar Pradesh", "201301, India"]} />
            <InfoItem icon={<MailIcon />} title="Email Us" lines={["support@bantconfirm.com", "sales@bantconfirm.com"]} />
            <InfoItem icon={<PhoneIcon />} title="Call Us" lines={["+91 120 123 4567"]} />
          </div>
        </div>
      </div>
    </div>
  );
};

const InfoItem: React.FC<{ icon: React.ReactNode; title: string; lines: string[] }> = ({ icon, title, lines }) => (
  <div className="flex items-start">
    <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center bg-indigo-100 rounded-full text-indigo-600">
      {icon}
    </div>
    <div className="ml-4">
      <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
      {lines.map((line, i) => <p key={i} className="text-gray-600">{line}</p>)}
    </div>
  </div>
);

const LocationIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;
const MailIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>;
const PhoneIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>;

export default ContactPage;