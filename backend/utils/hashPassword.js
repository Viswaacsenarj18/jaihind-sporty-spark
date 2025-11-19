import bcrypt from 'bcryptjs';

const generateAdminCredentials = async () => {
    // Default admin credentials - SAVE THESE FOR LOGIN
    const adminData = {
        name: "Jaihind Sports",
        email: "admin@example.com",
        password: "admin@123" // This is the password you'll use to login
    };

    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(adminData.password, salt);
        
        console.log('\n=== ADMIN CREDENTIALS (SAVE THESE) ===');
        console.log('=====================================');
        console.log('Name:', adminData.name);
        console.log('Email:', adminData.email);
        console.log('Password (USE THIS TO LOGIN):', adminData.password);
        console.log('Hashed Password:', hashedPassword);
        console.log('=====================================\n');
        
        return {
            name: adminData.name,
            email: adminData.email,
            password: hashedPassword
        };
    } catch (error) {
        console.error('Error generating admin credentials:', error);
        throw error;
    }
};

// Generate admin credentials
generateAdminCredentials();