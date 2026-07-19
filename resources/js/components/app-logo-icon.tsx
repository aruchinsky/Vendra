import type { ImgHTMLAttributes } from 'react';

type AppLogoIconProps = Omit<ImgHTMLAttributes<HTMLImageElement>, 'src'>;

export default function AppLogoIcon({
    alt = 'Logo de Vendra',
    className = '',
    ...props
}: AppLogoIconProps) {
    return (
        <img
            {...props}
            src="/logosimple.png"
            alt={alt}
            draggable={false}
            className={`object-contain ${className}`.trim()}
        />
    );
}
