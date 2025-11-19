const Footer = () => {
    return (
        <footer className="bg-gray-800 text-white py-8 mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div>
                        <h3 className="text-lg font-semibold mb-4">MRI Organoids Project</h3>
                        <p className="text-gray-300 text-sm">
                            Automated tissue segmentation of in vitro MRI data using combined GMM and U-Net approaches.
                        </p>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Institutions</h3>
                        <ul className="space-y-2 text-gray-300 text-sm">
                            <li>HAWK Hochschule für angewandte Wissenschaft und Kunst</li>
                            <li>Deutsches Primatenzentrum (DPZ), Göttingen</li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Contact</h3>
                        <p className="text-gray-300 text-sm">
                            Master Thesis Project<br />
                            Göttingen, Germany
                        </p>
                    </div>
                </div>
                <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400 text-sm">
                    &copy; {new Date().getFullYear()} MRI Organoids Segmentation Project. All rights reserved.
                </div>
            </div>
        </footer>
    );
};

export default Footer;
