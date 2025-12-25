'use client'

import styled from 'styled-components'

interface StyledCardProps {
    children: React.ReactNode
    className?: string
}

const CardWrapper = styled.div`
  background: linear-gradient(135deg, #1a1a1a 0%, #0f0f0f 100%);
  border: 1px solid #333;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);

  .card-title {
    text-align: center;
    color: #ff9966;
    font-size: 1.5rem;
    font-weight: bold;
    margin-bottom: 1.5rem;
  }

  .card-section {
    margin-bottom: 1.5rem;
  }

  .card-section:last-child {
    margin-bottom: 0;
  }

  .section-label {
    color: #888;
    font-size: 0.875rem;
    text-transform: uppercase;
    letter-spacing: 1px;
    margin-bottom: 0.75rem;
    display: block;
  }
`

export function StyledCard({ children, className }: StyledCardProps) {
    return (
        <CardWrapper className={className}>
            {children}
        </CardWrapper>
    )
}
