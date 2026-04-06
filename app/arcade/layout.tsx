export default function ArcadeLayout({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    return <div className="font-arcade min-h-screen">{children}</div>;
}
