// src/components/QrCodeModal.jsx

import { QRCodeSVG } from 'qrcode.react';

export default function QrCodeModal({ isOpen, onClose, token, courseName }) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
      <div className="bg-gray-800 p-8 rounded-xl shadow-lg text-center">
        <h2 className="text-xl font-bold text-white mb-2">Attendance Session Started</h2>
        <p className="text-blue-300 mb-4">{courseName}</p>
        
        <div className="bg-white p-4 rounded-lg inline-block">
          {token ? (
            <QRCodeSVG value={token} size={256} />
          ) : (
            <p className="text-black">Generating QR Code...</p>
          )}
        </div>
        
        <p className="text-gray-400 mt-4">This QR code is valid for 5 minutes.</p>
        <button
          onClick={onClose}
          className="mt-6 bg-red-600 hover:bg-red-700 px-6 py-2 rounded-lg text-white"
        >
          Close
        </button>
      </div>
    </div>
  );
}