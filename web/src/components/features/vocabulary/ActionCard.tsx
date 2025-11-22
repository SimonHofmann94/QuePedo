import React from 'react';
import styles from './ActionCard.module.css';
import { cn } from '@/lib/utils';

interface ActionCardProps {
    title: string;
    description: string;
    icon: React.ReactNode;
    badge?: string;
    onClick?: () => void;
    className?: string;
}

export function ActionCard({ title, description, icon, badge, onClick, className }: ActionCardProps) {
    return (
        <div className={cn(styles.card, "cursor-pointer", className)} onClick={onClick}>
            <div className={styles.content}>
                <div className={styles.back}>
                    <div className={styles.backContent}>
                        {icon}
                        <strong>{title}</strong>
                    </div>
                </div>
                <div className={styles.front}>
                    <div className={styles.img}>
                        <div className={styles.circle}></div>
                        <div className={cn(styles.circle, styles.circleRight)}></div>
                        <div className={cn(styles.circle, styles.circleBottom)}></div>
                    </div>
                    <div className={styles.frontContent}>
                        {badge && <small className={styles.badge}>{badge}</small>}
                        <div className={styles.description}>
                            <div className={styles.title}>
                                <p className={styles.title}>
                                    <strong>{title}</strong>
                                </p>
                            </div>
                            <p className={styles.cardFooter}>
                                {description}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
