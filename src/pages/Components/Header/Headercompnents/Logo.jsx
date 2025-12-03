import Link from 'next/link';

export default function Logo() {
  return (

    <div className='main_logo_oxy header-left'>
      <div className='logo_pic_oxy'>
        <Link href="/employeeDashboard">
          <img className='oxyem-logo' src='/assets/img/oxyem-logo.png' alt='icon' />
        </Link>
      </div>
      <div className='logo_text_oxy'>
        <p className='logo_text_oxyem'>Oxy<span>em</span></p>
        <p className='logo_b_text_oxyem'>Smart Connect</p>
      </div>
    </div>
  );
}
