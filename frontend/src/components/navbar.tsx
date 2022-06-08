import { Link } from "react-router-dom";


function Navbar() {
    return (
        <nav className="bg-white z-100 max-w-full">
            <div className="mx-auto p-4 h-16">
                <div className="flex justify-between items-center">
                    <div className="flex space-x-7">
                        {/* website logo & name */}
                        <div className='mt-[0.2em] logo px-2 py-0 rounded-md'>
                            <Link to={`/`}>
                                <h1 className="font-kanit text-[1.2em] font-bold uppercase">NFT BAY</h1>
                            </Link>
                        </div>
                        {/* links */}
                        <div>
                            <ul className="inline-flex mt-[0.6em] text-[0.85em] text-slate font-bold font-kanit uppercase">
                                <li className="tracking-wider mr-6">
                                    <Link to={`/explore`}>
                                        Explore
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    )
}

export default Navbar;