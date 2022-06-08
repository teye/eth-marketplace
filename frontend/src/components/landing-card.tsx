
type Props = {
    image: string;
    classNames?: string;
}

function LandingCard(props: Props) {

    const {
        image,
        classNames
    } = props;

    return (
        <div className={`rounded-xl shadow-lg h-80 w-80 ${classNames}`}>
        <img 
            src={image} 
            alt="landing" 
            className='rounded-xl object-cover h-80 w-80' 
        />
        </div>
    );
}

export default LandingCard;