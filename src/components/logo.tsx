import logo from '@/assets/mektune.png';
import Image from 'next/image';

export default function Logo() {
	return <Image src={logo} alt='Logo' className='h-40 w-auto' />;
}
