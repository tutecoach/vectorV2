import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://dwwxeqvfutxffgkmyqsa.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR3d3hlcXZmdXR4ZmZna215cXNhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MjU0NDc3OSwiZXhwIjoyMDg4MTIwNzc5fQ.1zSACn6Mw5cNdQAZ7Pzlld4EpDdTENTdkPgzwb3Nl_4';

const supabase = createClient(supabaseUrl, supabaseKey);

async function seedTechnicians() {
    console.log("Seeding mock technicians...");

    const mockUsers = [
        { id: '10000000-0000-0000-0000-000000000001', email: 'carlos.mendez@vector.com', name: 'Carlos Méndez' },
        { id: '10000000-0000-0000-0000-000000000002', email: 'ana.rios@vector.com', name: 'Ana Ríos' },
        { id: '10000000-0000-0000-0000-000000000003', email: 'luis.paredes@vector.com', name: 'Luis Paredes' },
        { id: '10000000-0000-0000-0000-000000000004', email: 'maria.garcia@vector.com', name: 'María García' }
    ];

    for (const user of mockUsers) {
        try {
            console.log(`Creating user ${user.name}...`);
            const { data: authData, error: authError } = await supabase.auth.admin.createUser({
                email: user.email,
                email_confirm: true,
                password: 'Password123!',
                user_metadata: { name: user.name }
            });

            if (authError) {
                console.log(`Skipped or Error for auth.users ${user.email}:`, authError.message);
            }

            const userId = authData?.user?.id;

            if (userId) {
                console.log(`Creating profile and role for ${user.name} with ID ${userId}...`);

                const { error: profileErr } = await supabase.from('profiles').upsert({
                    user_id: userId,
                    name: user.name
                }, { onConflict: 'user_id' });

                if (profileErr) console.error('Profile insert skip:', profileErr);

                const { error: roleErr } = await supabase.from('user_roles').insert({
                    user_id: userId,
                    role: 'tecnico'
                });

                if (roleErr) console.error('Role insert skip:', roleErr);
            }
        } catch (err) {
            console.error("Critical error inside loop:", err);
        }
    }
    console.log("Seeding complete! You can now verify the planning tab.");
}

seedTechnicians().catch(e => console.error("Global error:", e));
