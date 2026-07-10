-- UI language preference (distinct from native_language, which is learning
-- context for the AI). null = fall back to device/browser language.
alter table public.user_profiles
  add column if not exists app_locale text;

comment on column public.user_profiles.app_locale is
  'UI language: de | en | es. null = fall back to device/browser detection.';

-- Guard against bad values while leaving null (= auto-detect) allowed.
alter table public.user_profiles
  drop constraint if exists user_profiles_app_locale_check;
alter table public.user_profiles
  add constraint user_profiles_app_locale_check
  check (app_locale is null or app_locale in ('de', 'en', 'es'));
