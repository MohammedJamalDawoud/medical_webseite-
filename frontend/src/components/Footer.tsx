const Footer = () => {
    return (
        <footer style={{
            backgroundColor: 'var(--bg-surface)',
            marginTop: 'auto',
            padding: 'var(--space-8) 0',
            borderTop: '1px solid var(--border-subtle)'
        }}>
            <div className="container">
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: 'var(--space-4)'
                }}>
                    <div>
                        <p style={{
                            fontSize: 'var(--text-sm)',
                            color: 'var(--text-muted)',
                            margin: 0
                        }}>
                            MRI Organoids Segmentation Project
                        </p>
                        <p style={{
                            fontSize: 'var(--text-xs)',
                            color: 'var(--text-subtle)',
                            margin: 0,
                            marginTop: 'var(--space-1)'
                        }}>
                            HAWK Göttingen & DPZ • Master's Thesis 2025
                        </p>
                    </div>
                    <div style={{
                        fontSize: 'var(--text-xs)',
                        color: 'var(--text-subtle)'
                    }}>
                        © {new Date().getFullYear()} All rights reserved
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
