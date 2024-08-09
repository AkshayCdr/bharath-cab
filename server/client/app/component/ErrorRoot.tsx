export default function ErrorRoot({ message, stack }) {
    return (
        <section className="bg-white dark:bg-gray-900 h-screen ">
            <div className="mx-auto max-w-screen-sm text-center ">
                <h1 className="mb-4 text-7xl tracking-tight font-extrabold lg:text-9xl text-blue-700 ">
                    404
                </h1>
                <p className="mb-4 text-3xl tracking-tight font-bold text-white md:text-4xl ">
                    {message}
                </p>
                <div className=" text-white overflow-auto m-3 p-3">
                    <p className="h-72">{stack}</p>
                </div>
            </div>
        </section>
    );
}
