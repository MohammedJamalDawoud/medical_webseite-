const Footer = () => {
    return (
        <footer style={{ backgroundColor: 'var(--surface)', marginTop: 'auto', padding: '2rem 0' }}>
            <div className="container">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div>
                        <h3 className="text-lg font-bold mb-4">MRI Organoids Project</h3>
                        <p className="text-muted text-sm">
                            Automated tissue segmentation of in vitro MRI data using combined GMM and U-Net approaches.
                        </p>
                    </div>
                    <div>
                        <h3 className="text-lg font-bold mb-4">Institutions</h3>
                        <ul className="text-muted text-sm" style={{ listStyle: 'none', padding: 0 }}>
                            <li className="mb-2">HAWK Hochschule für angewandte Wissenschaft und Kunst</li>
                            <li>Deutsches Primatenzentrum (DPZ), Göttingen</li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-lg font-bold mb-4">Contact</h3>
                        <p className="text-muted text-sm">
                            Master Thesis Project<br />
                            Göttingen, Germany
                        </p>
                    </div>
                </div>
                <div className="mt-8 pt-8 text-center text-muted text-sm" style={{ borderTop: '1px solid var(--border)' }}>
                    &copy; {new Date().getFullYear()} MRI Organoids Segmentation Project. All rights reserved.
                </div>
            </div>
        </footer>
    );
};

export default Footer;
