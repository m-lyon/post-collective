function sendEmail(email, subject, textContent) {
    const sender = {
        email: `noreply@${process.env.MAIL_DOMAIN}`,
        name: 'noreply',
    };
    const to = [{ email }];
    return tranEmailApi.sendTransacEmail({
        sender,
        to,
        subject,
        textContent,
    });
}

function sendResetEmail(user, resetToken) {
    const subject = 'Reset password for Balmoral House Postal Collective';
    const textContent = `Dear ${user.name},

    We received a request to reset your password for your Balmoral House Postal Collective account.
    To reset your password, please click on the following link:

    ${process.env.BASE_URL}/resetPassword/${user._id}/${resetToken}

    If you did not request a password reset, please ignore this email.
    
    Note: This link will expire in 1 hour for security reasons. If you do not reset your password within that time, you will need to request a new password reset link.
    
    If you have any questions or concerns, please contact ${process.env.INFO_EMAIL}.`;
    return sendEmail(email, subject, textContent);
}

exports.sendResetEmail = sendResetEmail;
