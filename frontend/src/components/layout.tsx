import React from "react";
import { Toaster } from "react-hot-toast";
import Navbar from "./navbar";

type Props = {
    children?: React.ReactNode;
}

function LayoutDefault(props: Props) {
    const {
        children
    } = props;

    return (
        <div className="max-w-full">
            <Navbar />
            { children }
            <Toaster 
                position="top-center"
                reverseOrder={false}
            />
        </div>
    );
}

export default LayoutDefault;