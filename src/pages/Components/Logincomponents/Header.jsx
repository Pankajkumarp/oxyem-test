import Link from 'next/link';
export default function Header({languageContent}) {
  return (
    <div className="login-header">
		<div className="container">
		<div className="sk-logo-container">
		<img className='oxyem-logo logo login-page-logo' src='/assets/img/oxyem-logo.png' alt='icon' />
			<p className="logo-text-sk">Oxyem</p>
		</div>
		</div>
	</div>
  )
}
