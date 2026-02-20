import { useState, useEffect, useCallback } from 'react'
import { View, Text, ScrollView, StyleSheet, RefreshControl, TextInput, Alert } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Pencil, Save, LogOut, Crown } from 'lucide-react-native'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { useAuth } from '@/contexts/AuthContext'
import { useSubscription } from '@/contexts/SubscriptionContext'
import { supabase } from '@/lib/supabase'

export default function ProfileScreen() {
  const { user, signOut } = useAuth()
  const { isPremium, presentPaywall, presentCustomerCenter, refreshSubscription } = useSubscription()
  const [profile, setProfile] = useState<any>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editForm, setEditForm] = useState<any>({})
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

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

  useEffect(() => {
    fetchProfile()
  }, [fetchProfile])

  const onRefresh = useCallback(async () => {
    setRefreshing(true)
    await Promise.all([fetchProfile(), refreshSubscription()])
    setRefreshing(false)
  }, [fetchProfile, refreshSubscription])

  const handleSave = async () => {
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
      Alert.alert('Error', 'Failed to update profile')
    }
  }

  const handleLogout = () => {
    Alert.alert('Log out', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Log out', style: 'destructive', onPress: signOut },
    ])
  }

  const handleManageSubscription = () => {
    presentCustomerCenter()
  }

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loading}>
          <Text style={styles.loadingText}>Loading profile...</Text>
        </View>
      </SafeAreaView>
    )
  }

  if (!profile) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loading}>
          <Text style={styles.loadingText}>Please complete onboarding first.</Text>
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#F97316" />}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Profile</Text>
          <Button
            variant={isEditing ? 'primary' : 'outline'}
            onPress={isEditing ? handleSave : () => setIsEditing(true)}
            style={{ paddingVertical: 8, paddingHorizontal: 14 }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              {isEditing ? <Save size={16} color="#FFFFFF" /> : <Pencil size={16} color="#292524" />}
              <Text style={{ color: isEditing ? '#FFFFFF' : '#292524', fontWeight: '600', fontSize: 14 }}>
                {isEditing ? 'Save' : 'Edit'}
              </Text>
            </View>
          </Button>
        </View>

        {/* Avatar */}
        <View style={styles.avatarSection}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{profile.first_name?.[0]?.toUpperCase() || 'U'}</Text>
          </View>
          {isEditing ? (
            <TextInput
              style={styles.nameInput}
              value={editForm.first_name || ''}
              onChangeText={(v) => setEditForm({ ...editForm, first_name: v })}
              placeholder="Name"
              placeholderTextColor="#78716C"
            />
          ) : (
            <Text style={styles.profileName}>{profile.first_name || 'User'}</Text>
          )}
          <Text style={styles.profileHandle}>@{profile.native_language} Speaker</Text>
        </View>

        {/* Info Cards */}
        <View style={styles.infoGrid}>
          <Card style={styles.infoCard}>
            <Text style={styles.infoLabel}>Location</Text>
            {isEditing ? (
              <TextInput
                style={styles.editInput}
                value={editForm.location || ''}
                onChangeText={(v) => setEditForm({ ...editForm, location: v })}
              />
            ) : (
              <Text style={styles.infoValue}>{profile.location || 'N/A'}</Text>
            )}
          </Card>
          <Card style={styles.infoCard}>
            <Text style={styles.infoLabel}>Level</Text>
            <Text style={styles.infoValue}>{profile.proficiency_level || 'N/A'}</Text>
          </Card>
          <Card style={styles.infoCard}>
            <Text style={styles.infoLabel}>Subscription</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              {isPremium ? (
                <Badge variant="premium">Premium</Badge>
              ) : (
                <Text style={styles.infoValue}>Free</Text>
              )}
            </View>
          </Card>
          <Card style={styles.infoCard}>
            <Text style={styles.infoLabel}>Daily Goal</Text>
            <Text style={styles.infoValue}>{profile.daily_study_minutes} min</Text>
          </Card>
        </View>

        {/* Subscription Action */}
        {isPremium ? (
          <Button variant="outline" onPress={handleManageSubscription}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Crown size={18} color="#292524" />
              <Text style={{ color: '#292524', fontWeight: '600', fontSize: 16 }}>Manage Subscription</Text>
            </View>
          </Button>
        ) : (
          <Button onPress={presentPaywall}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Crown size={18} color="#FFFFFF" />
              <Text style={{ color: '#FFFFFF', fontWeight: '600', fontSize: 16 }}>Upgrade to Premium</Text>
            </View>
          </Button>
        )}

        {/* Focus */}
        <Card>
          <Text style={styles.focusLabel}>Current Focus</Text>
          <Text style={styles.focusValue}>{profile.learning_goals?.[0] || 'General Spanish'}</Text>
        </Card>

        {/* Member Since */}
        <Text style={styles.memberSince}>
          Member since {new Date(profile.created_at).toLocaleDateString()}
        </Text>

        {/* Logout */}
        <Button variant="destructive" onPress={handleLogout}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <LogOut size={18} color="#FFFFFF" />
            <Text style={{ color: '#FFFFFF', fontWeight: '600', fontSize: 16 }}>Log Out</Text>
          </View>
        </Button>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF7ED',
  },
  scroll: {
    padding: 20,
    gap: 20,
    paddingBottom: 40,
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 15,
    color: '#78716C',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#292524',
  },
  avatarSection: {
    alignItems: 'center',
    gap: 8,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#F97316',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  profileName: {
    fontSize: 22,
    fontWeight: '700',
    color: '#292524',
  },
  nameInput: {
    fontSize: 22,
    fontWeight: '700',
    color: '#292524',
    borderBottomWidth: 2,
    borderBottomColor: '#F97316',
    paddingVertical: 4,
    textAlign: 'center',
  },
  profileHandle: {
    fontSize: 14,
    color: '#78716C',
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  infoCard: {
    width: '47%',
    flexGrow: 1,
    gap: 4,
    paddingVertical: 14,
  },
  infoLabel: {
    fontSize: 12,
    color: '#78716C',
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#292524',
  },
  editInput: {
    fontSize: 16,
    fontWeight: '600',
    color: '#292524',
    borderBottomWidth: 1,
    borderBottomColor: '#F97316',
    paddingVertical: 2,
  },
  focusLabel: {
    fontSize: 13,
    color: '#78716C',
  },
  focusValue: {
    fontSize: 18,
    fontWeight: '600',
    color: '#292524',
    marginTop: 4,
  },
  memberSince: {
    fontSize: 12,
    color: '#78716C',
    textAlign: 'center',
  },
})
