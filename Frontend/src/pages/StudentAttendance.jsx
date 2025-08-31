import React, { useState, useEffect, useRef } from 'react';
import { Html5QrcodeScanner } from "html5-qrcode";
import apiClient from "../api/axios";

// This component encapsulates the HTML5 QR code scanner
const QrCodeScanner = ({ onScanSuccess, onScanError }) => {
    const scannerRef = useRef(null);

    useEffect(() => {
        if (!scannerRef.current) {
            const config = { fps: 10, qrbox: { width: 500, height: 500 }};
            const scanner = new Html5QrcodeScanner("reader", config, false);
            scanner.render(onScanSuccess, onScanError);
            scannerRef.current = scanner;
        }

        return () => {
            if (scannerRef.current) {
                scannerRef.current.clear().catch(console.error);
            }
        };
    }, [onScanSuccess, onScanError]);

    return (
        <div id="reader"></div>
    );
};

export default function StudentAttendance() {
    const [status, setStatus] = useState('Awaiting QR code scan...');
    const [isLoading, setIsLoading] = useState(false);
    const [isScanned, setIsScanned] = useState(false);
    const [error, setError] = useState('');

    const handleMarkAttendance = async (decodedToken, latitude, longitude) => {
        setIsLoading(true);
        setStatus('Location found! Marking attendance...');
        setError('');

        try {
            const response = await apiClient.post(`/attendance/mark/${decodedToken}`, {
                latitude,
                longitude,
            });
            setStatus(response.data.message);
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'An unexpected error occurred.';
            setError(errorMessage);
            setStatus('Attendance marking failed.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleScanSuccess = async (decodedText) => {
        if (isScanned) return;
        setIsScanned(true);

        try {
            setStatus('QR code scanned! Getting your location...');

            const position = await new Promise((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(resolve, reject, {
                    enableHighAccuracy: true,
                    timeout: 5000,
                    maximumAge: 0,
                });
            });

            const { latitude, longitude } = position.coords;
            handleMarkAttendance(decodedText, latitude, longitude);

        } catch (err) {
            console.error(err);
            if (err.code === 1) {
                setError('Location access denied. Please enable location services to mark attendance.');
            } else {
                setError('Failed to get your location. Please try again.');
            }
            setStatus('Attendance failed.');
        }
    };

    const handleScanError = (errorMessage) => {
        console.warn(errorMessage);
    };

    return (
        <div className="min-h-screen bg-gray-950 text-white p-6 flex flex-col items-center">
            <h1 className="text-2xl font-bold mb-4">Mark Attendance</h1>
            <p className="text-sm text-gray-400 mb-6">{status}</p>

            <div className="w-full max-w-sm bg-gray-800 rounded-lg shadow-lg overflow-hidden p-4">
                {isLoading ? (
                    <div className="flex justify-center items-center h-64">
                        <p>Processing...</p>
                    </div>
                ) : (
                    !isScanned && <QrCodeScanner onScanSuccess={handleScanSuccess} onScanError={handleScanError} />
                )}
            </div>

            {error && (
                <div className="mt-4 p-3 bg-red-600 rounded-lg text-white text-center">
                    <p>{error}</p>
                </div>
            )}
        </div>
    );
}