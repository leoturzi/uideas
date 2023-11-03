import Image from 'next/image';
import { MouseEventHandler } from 'react';

type Props = {
    title: string;
    type: 'button' | 'submit';
    leftIcon?: string | null;
    rightIcon?: string | null;
    handleClick?: MouseEventHandler<HTMLButtonElement>;
    isSubmitting?: boolean;
    bgColor?: string;
    textColor?: string;
};

function Button({
    title,
    type,
    leftIcon,
    rightIcon,
    handleClick,
    isSubmitting,
    bgColor,
    textColor,
}: Props) {
    return (
        <button
            type={type}
            className={`flexCenter px-4 py-3 gap-3 ${
                isSubmitting
                    ? 'bg-black/50'
                    : bgColor
                    ? bgColor
                    : 'bg-primary-purple'
            } 
            ${textColor ? textColor : 'text-white'}
            rounded-xl text-sm font-mediu max-md:w-full`}
            disabled={isSubmitting}
            onClick={handleClick}
        >
            {leftIcon && (
                <Image
                    src={leftIcon}
                    alt="left icon"
                    className="w-4 h-4"
                    width={14}
                    height={14}
                />
            )}
            {title}
            {rightIcon && (
                <Image
                    src={rightIcon}
                    alt="right icon"
                    className="w-4 h-4"
                    width={14}
                    height={14}
                />
            )}
        </button>
    );
}

export default Button;
