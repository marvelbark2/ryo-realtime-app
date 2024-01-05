export default function Entry({ children, id }: any) {
    return (
        <div className="min-h-screen flex flex-col" data-theme="winter" id={id}>
            {children}
        </div>
    )
}