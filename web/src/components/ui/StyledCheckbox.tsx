'use client'

import styled from 'styled-components'

interface StyledCheckboxProps {
    checked: boolean
    onChange: (checked: boolean) => void
    label?: string
    id?: string
}

const CheckboxWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;

  .checkbox-wrapper * {
    -webkit-tap-highlight-color: transparent;
    outline: none;
  }

  .checkbox-wrapper input[type="checkbox"] {
    display: none;
  }

  .checkbox-wrapper label {
    --size: 40px;
    --shadow: calc(var(--size) * 0.07) calc(var(--size) * 0.1);
    position: relative;
    display: block;
    width: var(--size);
    height: var(--size);
    background-color: #333;
    background-image: linear-gradient(135deg, #444 0%, #222 100%);
    border-radius: 50%;
    box-shadow: 0 var(--shadow) rgba(0, 0, 0, 0.3);
    cursor: pointer;
    transition: 0.2s ease transform, 0.2s ease background-color, 0.2s ease box-shadow;
    overflow: hidden;
    z-index: 1;
  }

  .checkbox-wrapper label:before {
    content: "";
    position: absolute;
    top: 50%;
    right: 0;
    left: 0;
    width: calc(var(--size) * 0.7);
    height: calc(var(--size) * 0.7);
    margin: 0 auto;
    background-color: #1a1a1a;
    transform: translateY(-50%);
    border-radius: 50%;
    box-shadow: inset 0 var(--shadow) rgba(0, 0, 0, 0.3);
    transition: 0.2s ease width, 0.2s ease height;
  }

  .checkbox-wrapper label:hover:before {
    width: calc(var(--size) * 0.55);
    height: calc(var(--size) * 0.55);
  }

  .checkbox-wrapper label:active {
    transform: scale(0.9);
  }

  .checkbox-wrapper .tick_mark {
    position: absolute;
    top: 8px;
    left: 2px;
    right: 0;
    width: calc(var(--size) * 0.6);
    height: calc(var(--size) * 0.6);
    margin: 0 auto;
    margin-left: calc(var(--size) * 0.14);
    transform: rotateZ(-40deg);
  }

  .checkbox-wrapper .tick_mark:before,
  .checkbox-wrapper .tick_mark:after {
    content: "";
    position: absolute;
    background-color: #fff;
    border-radius: 2px;
    opacity: 0;
    transition: 0.2s ease transform, 0.2s ease opacity;
  }

  .checkbox-wrapper .tick_mark:before {
    left: 0;
    bottom: 0;
    width: calc(var(--size) * 0.1);
    height: calc(var(--size) * 0.3);
    box-shadow: -2px 0 5px rgba(0, 0, 0, 0.23);
    transform: translateY(calc(var(--size) * -0.68));
  }

  .checkbox-wrapper .tick_mark:after {
    left: 0;
    bottom: 0;
    width: 100%;
    height: calc(var(--size) * 0.1);
    box-shadow: 0 3px 5px rgba(0, 0, 0, 0.23);
    transform: translateX(calc(var(--size) * 0.78));
  }

  .checkbox-wrapper input[type="checkbox"]:checked + label {
    background-color: #ff9966;
    background-image: linear-gradient(135deg, #ff9966 0%, #ff6633 100%);
    box-shadow: rgba(255, 153, 102, 0.3) 0px 10px 20px;
  }

  .checkbox-wrapper input[type="checkbox"]:checked + label:before {
    width: 0;
    height: 0;
  }

  .checkbox-wrapper input[type="checkbox"]:checked + label .tick_mark:before,
  .checkbox-wrapper input[type="checkbox"]:checked + label .tick_mark:after {
    background-color: #fff;
    opacity: 1;
  }

  .checkbox-wrapper input[type="checkbox"]:checked + label .tick_mark:before {
    left: 2px;
    bottom: 6px;
    width: calc(var(--size) * 0.1);
    height: calc(var(--size) * 0.25);
    transform: none;
  }

  .checkbox-wrapper input[type="checkbox"]:checked + label .tick_mark:after {
    left: 6px;
    bottom: 6px;
    width: calc(var(--size) * 0.4);
    height: calc(var(--size) * 0.1);
    transform: none;
  }

  .label-text {
    color: #fff;
    font-size: 14px;
    cursor: pointer;
    user-select: none;
  }
`

export function StyledCheckbox({ checked, onChange, label, id }: StyledCheckboxProps) {
    const checkboxId = id || `checkbox-${Math.random().toString(36).substr(2, 9)}`

    return (
        <CheckboxWrapper>
            <div className="checkbox-wrapper">
                <input
                    type="checkbox"
                    id={checkboxId}
                    checked={checked}
                    onChange={(e) => onChange(e.target.checked)}
                />
                <label htmlFor={checkboxId}>
                    <div className="tick_mark" />
                </label>
            </div>
            {label && (
                <span className="label-text" onClick={() => onChange(!checked)}>
                    {label}
                </span>
            )}
        </CheckboxWrapper>
    )
}
