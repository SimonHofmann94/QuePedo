import { useState, useEffect, useCallback } from 'react'
import { View, Text, ScrollView, StyleSheet, RefreshControl, TextInput, Alert, Pressable } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useTranslation } from 'react-i18next'
import { Pencil, Save, LogOut, Crown } from 'lucide-react-native'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Avatar } from '@/components/ui/Avatar'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { useAuth } from '@/contexts/AuthContext'
import { useSubscription } from '@/contexts/SubscriptionContext'
import { supabase } from '@/lib/supabase'
import { setLocale } from '@/lib/i18n'
import { colors, fontFamily, surface } from '@/constants/theme'
import { ACHIEVEMENTS, LOCALES, LOCALE_LABELS, type Achievement } from '@chingon/shared'
import { getUserAchievements } from '@/services/achievements'

type Profile = {
  id: string
  first_name?: string
  location?: string
  native_language?: string
  proficiency_level?: string
  learning_goals?: string[]
  daily_study_minutes?: number
  created_at?: string
}

export default function ProfileScreen() {
  const { user, signOut } = useAuth()
  const { t, i18n } = useTranslation('common')
  const { isPremium, presentPaywall, presentCustomerCenter, refreshSubscription } = useSubscription()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editForm, setEditForm] = useState<Profile>({} as Profile)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [earnedIds, setEarnedIds] = useState<Set<string>>(new Set())

  const fetchProfile = useCallback(async () => {
    if (!user) return
    const { data } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    if (data) {
      setProfile(data)
      setEditForm(data)
    }
    setLoading(false)
  }, [user])

  const fetchAchievements = useCallback(async () => {
    if (!user) return
    try {
      const rows = await getUserAchievements()
      setEarnedIds(new Set(rows.map((r) => r.id)))
    } catch (err) {
      console.error('[profile] load achievements failed:', err)
    }
  }, [user])

  useEffect(() => {
    fetchProfile()
    fetchAchievements()
  }, [fetchProfile, fetchAchievements])

  const onRefresh = useCallback(async () => {
    setRefreshing(true)
    await Promise.all([fetchProfile(), refreshSubscription(), fetchAchievements()])
    setRefreshing(false)
  }, [fetchProfile, refreshSubscription, fetchAchievements])

  const handleSave = async () => {
    if (!profile) return
    const { error } = await supabase
      .from('user_profiles')
      .update({
        first_name: editForm.first_name,
        location: editForm.location,
        native_language: editForm.native_language,
        proficiency_level: editForm.proficiency_level,
      })
      .eq('id', profile.id)

    if (!error) {
      setProfile(editForm)
      setIsEditing(false)
    } else {
      Alert.alert('¡Ay, no!', 'No se pudo actualizar el perfil')
    }
  }

  const handleLogout = () => {
    Alert.alert('Cerrar sesión', '¿Seguro que quieres salir?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Salir', style: 'destructive', onPress: signOut },
    ])
  }

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loading}>
          <Text style={styles.loadingText}>Cocinando…</Text>
        </View>
      </SafeAreaView>
    )
  }

  if (!profile) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loading}>
          <Text style={styles.loadingText}>Completa el onboarding primero.</Text>
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.chili[500]} />
        }
      >
        {/* Hero card */}
        <View style={styles.hero}>
          <View style={styles.avatarRow}>
            <Avatar
              name={profile.first_name || 'U'}
              color={colors.maiz[400]}
              size={80}
            />
            <View style={styles.avatarBadge}>
              <Text style={styles.avatarBadgeText}>
                {profile.proficiency_level?.substring(0, 2).toUpperCase() || 'A1'}
              </Text>
            </View>
          </View>
          {isEditing ? (
            <TextInput
              style={styles.nameInput}
              value={editForm.first_name || ''}
              onChangeText={(v) => setEditForm({ ...editForm, first_name: v })}
              placeholder="Nombre"
              placeholderTextColor={colors.ink[400]}
            />
          ) : (
            <Text style={styles.heroName}>{profile.first_name || 'Colega'}</Text>
          )}
          <Text style={styles.heroHandle}>colega hablando {profile.native_language || 'español'}</Text>
          <View style={styles.heroBadges}>
            {isPremium && <Badge color="maiz" variant="solid" size="sm">👑 Premium</Badge>}
            <Badge color="chili" variant="soft" size="sm">🔥 14 días</Badge>
          </View>
        </View>

        {/* Edit/Save */}
        <Button
          onPress={isEditing ? handleSave : () => setIsEditing(true)}
          variant={isEditing ? 'primary' : 'ghost'}
          size="md"
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            {isEditing ? <Save size={16} color="#FFFFFF" /> : <Pencil size={16} color={colors.ink[700]} />}
            <Text style={{
              color: isEditing ? '#FFFFFF' : colors.ink[700],
              fontFamily: fontFamily.bodyBold,
              fontSize: 14,
            }}>
              {isEditing ? 'Guardar' : 'Editar perfil'}
            </Text>
          </View>
        </Button>

        {/* Info grid */}
        <View style={styles.infoGrid}>
          <View style={styles.infoCard}>
            <Text style={styles.infoLabel}>Ubicación</Text>
            {isEditing ? (
              <TextInput
                style={styles.editInput}
                value={editForm.location || ''}
                onChangeText={(v) => setEditForm({ ...editForm, location: v })}
              />
            ) : (
              <Text style={styles.infoValue}>{profile.location || '—'}</Text>
            )}
          </View>
          <View style={styles.infoCard}>
            <Text style={styles.infoLabel}>Nivel</Text>
            <Text style={styles.infoValue}>{profile.proficiency_level || '—'}</Text>
          </View>
          <View style={styles.infoCard}>
            <Text style={styles.infoLabel}>Suscripción</Text>
            <Text style={[styles.infoValue, { color: isPremium ? colors.maiz[600] : colors.ink[800] }]}>
              {isPremium ? 'Premium' : 'Free'}
            </Text>
          </View>
          <View style={styles.infoCard}>
            <Text style={styles.infoLabel}>Meta diaria</Text>
            <Text style={styles.infoValue}>{profile.daily_study_minutes || 15} min</Text>
          </View>
        </View>

        {/* Current focus */}
        <View style={styles.focusCard}>
          <Text style={styles.focusEyebrow}>FOCO ACTUAL</Text>
          <Text style={styles.focusTitle}>{profile.learning_goals?.[0] || 'Español general'}</Text>
          <Text style={styles.focusDesc}>Tu camino personalizado al chingón</Text>
          <View style={{ marginTop: 10 }}>
            <ProgressBar value={62} color="#FFFFFF" trackColor="rgba(255,255,255,0.25)" height={6} />
            <Text style={styles.focusProgress}>62% · 18 / 30 unidades</Text>
          </View>
        </View>

        {/* Achievements */}
        <View style={styles.achHeader}>
          <Text style={styles.achTitle}>Logros</Text>
          <Text style={styles.achCount}>
            {earnedIds.size} de {ACHIEVEMENTS.length} desbloqueados
          </Text>
        </View>
        <View style={styles.achGrid}>
          {ACHIEVEMENTS.map((a) => (
            <AchievementTile
              key={a.id}
              achievement={a}
              earned={earnedIds.has(a.id)}
            />
          ))}
        </View>

        {/* Subscription CTA */}
        {isPremium ? (
          <Button variant="ghost" onPress={presentCustomerCenter}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Crown size={18} color={colors.maiz[600]} />
              <Text style={{ color: colors.ink[700], fontFamily: fontFamily.bodyBold, fontSize: 15 }}>
                Gestionar suscripción
              </Text>
            </View>
          </Button>
        ) : (
          <Button onPress={presentPaywall} variant="primary" size="lg">
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Crown size={18} color="#FFFFFF" />
              <Text style={{ color: '#FFFFFF', fontFamily: fontFamily.bodyBold, fontSize: 15 }}>
                ¡Dale! Vuélvete Premium
              </Text>
            </View>
          </Button>
        )}

        {profile.created_at && (
          <Text style={styles.memberSince}>
            Colega desde {new Date(profile.created_at).toLocaleDateString('es-MX')}
          </Text>
        )}

        {/* Language switcher */}
        <View style={styles.langCard}>
          <Text style={styles.langLabel}>{t('appLanguage')}</Text>
          <View style={styles.langRow}>
            {LOCALES.map((loc) => {
              const active = i18n.language === loc
              return (
                <Pressable
                  key={loc}
                  onPress={() => setLocale(loc, user?.id)}
                  style={[styles.langPill, active && styles.langPillActive]}
                >
                  <Text style={[styles.langPillText, active && styles.langPillTextActive]}>
                    {LOCALE_LABELS[loc]}
                  </Text>
                </Pressable>
              )
            })}
          </View>
        </View>

        {/* Logout */}
        <Button variant="danger" onPress={handleLogout} size="md">
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <LogOut size={18} color="#FFFFFF" />
            <Text style={{ color: '#FFFFFF', fontFamily: fontFamily.bodyBold, fontSize: 15 }}>
              Cerrar sesión
            </Text>
          </View>
        </Button>
      </ScrollView>
    </SafeAreaView>
  )
}

function AchievementTile({
  achievement,
  earned,
}: {
  achievement: Achievement
  earned: boolean
}) {
  const family = (colors as Record<string, Record<string, string>>)[achievement.color]
  const accent = family?.['500'] ?? family?.['400'] ?? colors.ink[800]
  return (
    <View style={styles.achTileWrap}>
      <View
        style={[
          styles.achTile,
          {
            backgroundColor: earned ? '#FFFFFF' : colors.ink[50],
            borderColor: earned ? accent : colors.ink[200],
            borderStyle: earned ? 'solid' : 'dashed',
            opacity: earned ? 1 : 0.45,
          },
        ]}
      >
        <Text style={styles.achEmoji}>{achievement.emoji}</Text>
      </View>
      <Text
        style={[
          styles.achLabel,
          { color: earned ? colors.ink[700] : colors.ink[400] },
        ]}
        numberOfLines={2}
      >
        {achievement.label}
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: surface.bg },
  scroll: { padding: 20, gap: 16, paddingBottom: 40 },
  loading: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { fontFamily: fontFamily.body, fontSize: 15, color: colors.ink[500] },

  hero: {
    backgroundColor: colors.chili[500],
    borderRadius: 24, padding: 24, alignItems: 'center', gap: 8,
  },
  avatarRow: { position: 'relative' },
  avatarBadge: {
    position: 'absolute', bottom: -4, right: -4,
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: colors.jade[500], borderWidth: 3, borderColor: '#FFFFFF',
    alignItems: 'center', justifyContent: 'center',
  },
  avatarBadgeText: { fontFamily: fontFamily.displayExtraBold, fontSize: 11, color: '#FFFFFF' },
  heroName: {
    fontFamily: fontFamily.displayExtraBold, fontSize: 28, color: '#FFFFFF', letterSpacing: -0.5,
  },
  nameInput: {
    fontFamily: fontFamily.displayExtraBold, fontSize: 28, color: '#FFFFFF',
    borderBottomWidth: 2, borderBottomColor: 'rgba(255,255,255,0.5)',
    textAlign: 'center', paddingVertical: 4, minWidth: 200,
  },
  heroHandle: { fontFamily: fontFamily.marker, fontSize: 18, color: colors.maiz[200] },
  heroBadges: { flexDirection: 'row', gap: 6, marginTop: 6 },

  infoGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  infoCard: {
    width: '47%', flexGrow: 1,
    backgroundColor: surface.card, borderWidth: 1, borderColor: colors.ink[100],
    borderRadius: 14, padding: 14, gap: 4,
  },
  infoLabel: {
    fontFamily: fontFamily.monoBold, fontSize: 10, letterSpacing: 1,
    color: colors.ink[400], textTransform: 'uppercase',
  },
  infoValue: {
    fontFamily: fontFamily.displayExtraBold, fontSize: 16, color: colors.ink[800],
  },
  editInput: {
    fontFamily: fontFamily.bodyBold, fontSize: 15, color: colors.ink[800],
    borderBottomWidth: 1, borderBottomColor: colors.chili[500],
    paddingVertical: 2,
  },

  focusCard: {
    backgroundColor: colors.cielo[500], borderRadius: 20, padding: 18,
  },
  focusEyebrow: {
    fontFamily: fontFamily.monoBold, fontSize: 10, letterSpacing: 2,
    color: 'rgba(255,255,255,0.8)',
  },
  focusTitle: {
    fontFamily: fontFamily.displayExtraBold, fontSize: 22, color: '#FFFFFF', marginTop: 4,
  },
  focusDesc: { fontFamily: fontFamily.body, fontSize: 12, color: 'rgba(255,255,255,0.85)', marginTop: 4 },
  focusProgress: {
    fontFamily: fontFamily.monoBold, fontSize: 10, color: 'rgba(255,255,255,0.85)', marginTop: 4,
  },
  memberSince: {
    fontFamily: fontFamily.monoBold, fontSize: 11, color: colors.ink[400],
    textAlign: 'center',
  },

  langCard: {
    backgroundColor: surface.card, borderWidth: 1, borderColor: colors.ink[100],
    borderRadius: 20, padding: 16, gap: 12,
  },
  langLabel: {
    fontFamily: fontFamily.monoBold, fontSize: 10, letterSpacing: 1,
    color: colors.ink[400], textTransform: 'uppercase',
  },
  langRow: { flexDirection: 'row', gap: 8 },
  langPill: {
    flex: 1, height: 44, borderRadius: 999,
    borderWidth: 2, borderColor: colors.ink[200], backgroundColor: '#FFFFFF',
    alignItems: 'center', justifyContent: 'center',
  },
  langPillActive: {
    borderColor: colors.chili[500], backgroundColor: colors.chili[50],
  },
  langPillText: {
    fontFamily: fontFamily.bodyBold, fontSize: 13, color: colors.ink[600],
  },
  langPillTextActive: { color: colors.chili[700] },

  achHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end',
    marginTop: 4,
  },
  achTitle: {
    fontFamily: fontFamily.displayExtraBold, fontSize: 18, color: colors.ink[800],
  },
  achCount: {
    fontFamily: fontFamily.monoBold, fontSize: 10, letterSpacing: 1,
    color: colors.ink[500], textTransform: 'uppercase',
  },
  achGrid: {
    flexDirection: 'row', flexWrap: 'wrap', gap: 10,
    backgroundColor: surface.card,
    borderRadius: 20, borderWidth: 1, borderColor: colors.ink[100],
    padding: 14,
  },
  achTileWrap: {
    width: '22%', alignItems: 'center', gap: 6,
  },
  achTile: {
    width: '100%', aspectRatio: 1,
    borderRadius: 14, borderWidth: 3,
    alignItems: 'center', justifyContent: 'center',
  },
  achEmoji: { fontSize: 22 },
  achLabel: {
    fontFamily: fontFamily.monoBold, fontSize: 9, letterSpacing: 0.5,
    textAlign: 'center', textTransform: 'uppercase',
  },
})
