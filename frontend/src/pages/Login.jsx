import React from 'react';
import { Authentication } from '../components/Authentication';

/**
 * Login page
 * User authentication & access gateway page
 */
export default function LoginPage(props) {
  return (
    <Authentication
      darkMode={props.darkMode ?? true}
      onLoginSuccess={props.onLoginSuccess ?? ((email) => console.log('Login success:', email))}
      onNavigate={props.onNavigate ?? ((screen) => console.log('Navigate:', screen))}
      onTriggerToast={props.onTriggerToast ?? ((msg) => console.log('Toast:', msg))}
    />
  );
}

export { Authentication as Login };
