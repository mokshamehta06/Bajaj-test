import { motion } from 'framer-motion';

export default function TeamView() {
  const team = [
    { name: 'Moksha Mehta', role: 'Lead Agent', status: 'online', avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=Moksha' },
    { name: 'Alex Chen', role: 'Support Specialist', status: 'online', avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=Alex' },
    { name: 'Sarah Jones', role: 'Technical Support', status: 'offline', avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=Sarah' },
    { name: 'David Kim', role: 'Customer Success', status: 'online', avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=David' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="team-view"
      style={{ display: 'flex', flexDirection: 'column', gap: '2rem', padding: '1rem' }}
    >
      <div className="page-header" style={{ marginBottom: '1rem' }}>
        <h2>Team Directory</h2>
        <p>Manage your support team and view agent availability.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1.5rem' }}>
        {team.map((member, idx) => (
          <motion.div 
            key={member.name}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.1 }}
            className="glass-card team-card" 
            style={{ 
              padding: '1.5rem', 
              background: 'rgba(20,20,20,0.6)', 
              borderRadius: '16px', 
              border: '1px solid rgba(255,255,255,0.1)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              gap: '1rem'
            }}
          >
            <div style={{ position: 'relative' }}>
              <img 
                src={member.avatar} 
                alt={member.name} 
                style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'var(--glass-bg)' }}
              />
              <div 
                style={{ 
                  position: 'absolute', 
                  bottom: '0', 
                  right: '5px', 
                  width: '14px', 
                  height: '14px', 
                  borderRadius: '50%', 
                  background: member.status === 'online' ? 'var(--color-low)' : 'var(--text-muted)',
                  border: '2px solid #141414'
                }} 
                title={member.status}
              />
            </div>
            
            <div>
              <h3 style={{ fontSize: '1.1rem', margin: 0, color: 'var(--text-primary)' }}>{member.name}</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--accent)', margin: '0.2rem 0 0 0' }}>{member.role}</p>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
              <button className="btn-transition" style={{ padding: '0.3rem 0.6rem', fontSize: '0.7rem' }}>Message</button>
              <button className="btn-transition" style={{ padding: '0.3rem 0.6rem', fontSize: '0.7rem' }}>Assign</button>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
