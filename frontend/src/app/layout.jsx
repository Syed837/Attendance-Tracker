import '../styles/globals.css';

export const metadata = {
    title: 'MITS Attendance Tracker',
    description: 'Track your MITS attendance instantly',
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body>{children}</body>
        </html>
    );
}
