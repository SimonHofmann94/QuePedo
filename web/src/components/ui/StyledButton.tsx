'use client'

import styled from 'styled-components'

interface StyledButtonProps {
    children: React.ReactNode
    onClick?: () => void
    disabled?: boolean
    variant?: 'primary' | 'secondary'
    className?: string
    type?: 'button' | 'submit'
}

const ButtonWrapper = styled.div<{ $variant: 'primary' | 'secondary' }>`
  button {
    padding: 1.3em 3em;
    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: 2.5px;
    font-weight: 500;
    color: ${props => props.$variant === 'primary' ? '#000' : '#fff'};
    background-color: ${props => props.$variant === 'primary' ? '#fff' : '#333'};
    border: none;
    border-radius: 45px;
    box-shadow: 0px 8px 15px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease 0s;
    cursor: pointer;
    outline: none;
    width: 100%;
  }

  button:hover:not(:disabled) {
    background-color: #ff9966;
    box-shadow: 0px 15px 20px rgba(255, 153, 102, 0.4);
    color: #fff;
    transform: translateY(-7px);
  }

  button:active:not(:disabled) {
    transform: translateY(-1px);
  }

  button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`

export function StyledButton({
    children,
    onClick,
    disabled,
    variant = 'primary',
    className,
    type = 'button'
}: StyledButtonProps) {
    return (
        <ButtonWrapper $variant={variant} className={className}>
            <button onClick={onClick} disabled={disabled} type={type}>
                {children}
            </button>
        </ButtonWrapper>
    )
}
