import { Link } from "react-router-dom";


function Error() {
    return (
        <div className="container mx-auto text-center">
            <h1 className="font-bold text-7xl mt-16 mb-4">Not Found</h1>
            <div className="mb-8">The page you are trying to visit does not exist.</div>
            <Link to={`/`}>
                <button 
                    className="bg-white text-black text-sm font-semibold py-2 px-4 border border-black rounded">
                    Back to Home
                </button>
            </Link>
        </div>
    );
}

export default Error;