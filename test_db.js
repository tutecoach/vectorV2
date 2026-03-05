import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY; // Corrected key name

if (!supabaseUrl || !supabaseKey) {
    console.error("Missing SUPABASE env vars.", { supabaseUrl, supabaseKey });
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
    console.log("Fetching profiles to get a valid technician_id...");
    const { data: profiles, error: err1 } = await supabase.from('profiles').select('*').limit(5);

    if (err1) {
        console.error("Error fetching profiles:", err1);
        return;
    }

    console.log("Profiles found:", profiles?.length);

    if (profiles && profiles.length > 0) {
        const testTechId = profiles[0].id;
        console.log("Testing insert into work_orders with technician_id =", testTechId);

        // We will pass an invalid client_id just to see if the error is 
        // work_orders_technician_id_fkey or work_orders_client_id_fkey.
        // It validates constraints in a deterministic order or we can use a valid client_id if we fetch one.
        const { data: clients } = await supabase.from('clients').select('id').limit(1);
        const clientId = clients?.[0]?.id || '00000000-0000-0000-0000-000000000000';

        const { data, error } = await supabase.from('work_orders').insert({
            client_id: clientId,
            site_id: null,
            technician_id: testTechId,
            status: 'pendiente',
            flexible_schedule: false
        });

        console.log("Insert result error:", error);
    } else {
        console.log("No profiles found to test with.");
    }
}
test();
