-- Create vocabulary table
create table vocabulary (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  term text not null,
  translation text not null,
  context_sentence text,
  difficulty_rating int check (difficulty_rating between 1 and 5) default 1,
  tags text[],
  created_at timestamptz default now()
);

-- Enable RLS
alter table vocabulary enable row level security;

-- Create policies
create policy "Users can view their own vocabulary"
  on vocabulary for select
  using (auth.uid() = user_id);

create policy "Users can insert their own vocabulary"
  on vocabulary for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own vocabulary"
  on vocabulary for update
  using (auth.uid() = user_id);

create policy "Users can delete their own vocabulary"
  on vocabulary for delete
  using (auth.uid() = user_id);
