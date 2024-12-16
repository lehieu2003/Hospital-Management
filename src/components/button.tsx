import { Button as BootstrapBtn } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

interface ButtonProps extends React.ComponentProps<typeof BootstrapBtn> {
  href?: string;
  icon?: React.ReactNode;
}

function Button({ href, children, icon, onClick, ...props }: ButtonProps) {
  const navigate = useNavigate();
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (href) {
      if (href.startsWith('#')) {
        window.location.hash = href;
        return;
      }
      navigate(href);
    }
    onClick && onClick(e);
  };

  return (
    <BootstrapBtn {...props} onClick={handleClick}>
      {children}
      {icon}
    </BootstrapBtn>
  );
}

export default Button;
