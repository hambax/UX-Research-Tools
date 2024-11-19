import React from 'react';
import { Button as MuiButton, ButtonProps as MuiButtonProps, styled } from '@mui/material';

interface ButtonBaseProps extends Omit<MuiButtonProps, 'variant'> {
  variant?: 'primary' | 'secondary' | 'text';
}

const BaseButton = styled(MuiButton)<ButtonBaseProps>(({ theme }) => ({
  height: '48px',
  minWidth: '120px',
  padding: '12px 24px',
  borderRadius: '8px',
  textTransform: 'none',
  fontFamily: 'Inter, sans-serif',
  fontSize: '16px',
  fontWeight: 500,
  transition: 'all 0.2s ease-in-out',

  '&:disabled': {
    opacity: 0.6,
    cursor: 'not-allowed',
  },
}));

export const PrimaryButton = styled(BaseButton)(({ theme }) => ({
  backgroundColor: '#2196F3',
  color: '#FFFFFF',
  '&:hover': {
    backgroundColor: '#1976D2',
  },
}));

export const SecondaryButton = styled(BaseButton)(({ theme }) => ({
  backgroundColor: 'transparent',
  color: '#2196F3',
  border: '1px solid #2196F3',
  '&:hover': {
    backgroundColor: 'rgba(33, 150, 243, 0.04)',
  },
}));

export const TextButton = styled(BaseButton)(({ theme }) => ({
  backgroundColor: 'transparent',
  color: '#2196F3',
  minWidth: 'auto',
  padding: '8px 16px',
  '&:hover': {
    backgroundColor: 'rgba(33, 150, 243, 0.04)',
  },
}));

export const IconButtonWrapper = styled('div')({
  height: '48px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

const Button: React.FC<ButtonBaseProps> = ({ variant = 'primary', ...props }) => {
  const ButtonComponent = {
    primary: PrimaryButton,
    secondary: SecondaryButton,
    text: TextButton,
  }[variant] || PrimaryButton;

  return <ButtonComponent {...props} />;
};

export default Button;
