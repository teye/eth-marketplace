import './App.css';
import LandingCard from './components/landing-card';
import MainCard01 from './images/main_card_01.jpg';
import MainCard02 from './images/main_card_02.jpg';
import MainCard03 from './images/main_card_03.jpg';


function App() {
  return (
    <div className="h-full bg-landing">
      <div className="grid grid-cols-1 lg:grid-cols-2 justify-items-center items-center">
        <div className='font-bold text-5xl text-black uppercase mt-8 lg:-mt-[8em] lg:ml-auto lg:p-8'>
          <p>The<br/>NFT<br/>Marketplace<br/><span className='text-[0.89em] italic'>you'll ever use.</span></p>
        </div>
        <div className='lg:mr-auto'>
          <div className='mt-[10em] lg:mt-[18em] mr-[6em]'>
            {/* images */}
            <LandingCard 
              image={MainCard01}
            />
            <LandingCard
              image={MainCard02}
              classNames={`relative -right-[6em] -top-[22em]`}
            />
            <LandingCard
              image={MainCard03}
              classNames={`relative -right-[3em] -top-[38em]`}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
