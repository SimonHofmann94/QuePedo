"use client"

import React, { useEffect, useState } from 'react';
import styles from './ProfileCard.module.css';
import { createClient } from '@/utils/supabase/client';
import { Pencil, Save, X } from 'lucide-react';

export function ProfileCard() {
    const supabase = createClient()
    const [profile, setProfile] = useState<any>(null)
    const [isEditing, setIsEditing] = useState(false)
    const [editForm, setEditForm] = useState<any>({})
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchProfile()
    }, [])

    const fetchProfile = async () => {
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
            const { data } = await supabase
                .from('user_profiles')
                .select('*')
                .eq('id', user.id)
                .single()

            if (data) {
                setProfile(data)
                setEditForm(data)
            }
        }
        setLoading(false)
    }

    const handleSave = async () => {
        const { error } = await supabase
            .from('user_profiles')
            .update({
                first_name: editForm.first_name,
                location: editForm.location,
                native_language: editForm.native_language,
                proficiency_level: editForm.proficiency_level
            })
            .eq('id', profile.id)

        if (!error) {
            setProfile(editForm)
            setIsEditing(false)
        } else {
            alert("Failed to update profile")
        }
    }

    if (loading) return <div>Loading profile...</div>
    if (!profile) return <div>Please complete onboarding first.</div>

    return (
        <div className={styles.cardContainer}>
            <div className={styles.comicCard}>
                <div className={styles.cardHeader}>
                    <div className={styles.cardAvatar}>
                        {profile.first_name?.[0] || "U"}
                    </div>
                    <div className={styles.cardUserInfo}>
                        {isEditing ? (
                            <input
                                className={styles.editInput}
                                value={editForm.first_name || ''}
                                onChange={e => setEditForm({ ...editForm, first_name: e.target.value })}
                                placeholder="Name"
                            />
                        ) : (
                            <p className={styles.cardUsername}>{profile.first_name || "User"}</p>
                        )}
                        <p className={styles.cardHandle}>@{profile.native_language} Speaker</p>
                    </div>
                    <button
                        className={styles.actionButton}
                        onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                        style={{ padding: '0.3em' }}
                    >
                        {isEditing ? <Save size={20} /> : <Pencil size={20} />}
                    </button>
                </div>

                <div className={styles.cardContent}>
                    <div className={styles.infoGrid}>
                        <div className={styles.infoItem}>
                            <span className={styles.infoLabel}>Location</span>
                            {isEditing ? (
                                <input
                                    className={styles.editInput}
                                    value={editForm.location || ''}
                                    onChange={e => setEditForm({ ...editForm, location: e.target.value })}
                                />
                            ) : (
                                <div className={styles.infoValue}>{profile.location || "N/A"}</div>
                            )}
                        </div>
                        <div className={styles.infoItem}>
                            <span className={styles.infoLabel}>Level</span>
                            <div className={styles.infoValue}>{profile.proficiency_level || "N/A"}</div>
                        </div>
                        <div className={styles.infoItem}>
                            <span className={styles.infoLabel}>Style</span>
                            <div className={styles.infoValue}>{profile.learning_style || "N/A"}</div>
                        </div>
                        <div className={styles.infoItem}>
                            <span className={styles.infoLabel}>Daily Goal</span>
                            <div className={styles.infoValue}>{profile.daily_study_minutes} min</div>
                        </div>
                    </div>

                    <div className={styles.cardImageContainer}>
                        <div className="text-center">
                            <div className="text-sm opacity-80">Current Focus</div>
                            <div className="font-bold mt-1">
                                {profile.learning_goals?.[0] || "General Spanish"}
                            </div>
                        </div>
                    </div>

                    <p className={styles.cardCaption}>
                        MEANWHILE... {profile.first_name} is on a mission to master Spanish for {profile.learning_goals?.join(", ")}!
                    </p>
                </div>

                <div className={styles.cardActions}>
                    <div className="text-xs text-center w-full opacity-50">
                        Member since {new Date(profile.created_at).toLocaleDateString()}
                    </div>
                </div>
            </div>
        </div>
    );
}
