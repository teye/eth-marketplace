import React from "react";
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
        </div>
    );
}

export default LayoutDefault;