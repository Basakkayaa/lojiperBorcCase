import React from 'react';
import { Menubar } from 'primereact/menubar';
import 'primeicons/primeicons.css';    
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
  const items = [
    {
      label: 'Home',
      icon: 'pi pi-home',
      template: (item: any, options: any) => (
        <Link to="/" className={options.className} style={{ textDecoration: 'none' }}>
          <i className={`${item.icon} ${options.iconClassName}`} style={{ marginRight: '4px' }}></i>
          {item.label}
        </Link>
      )
    },
    {
      label: 'Contact',
      icon: 'pi pi-envelope',
    },
    {
      label: 'Sign Up',
      icon: 'pi pi-user',
      template: (item: any, options: any) => (
        <Link to="/Register" className={options.className} style={{ textDecoration: 'none' }}>
          <i className={`${item.icon} ${options.iconClassName}`} style={{ marginRight: '4px' }}></i>
          {item.label}
        </Link>
      )
    },
    {
      label: 'Login',
      icon: 'pi pi-user',
      template: (item: any, options: any) => (
        <Link to="/Login" className={options.className} style={{ textDecoration: 'none' }}>
          <i className={`${item.icon} ${options.iconClassName}`} style={{ marginRight: '4px' }}></i>
          {item.label}
        </Link>
      )
    },
  ];

  return (
    <div>
      <Menubar model={items} />
    </div>
  );
}

export default Header;
