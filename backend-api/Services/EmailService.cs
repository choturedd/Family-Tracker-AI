using MailKit.Net.Smtp;
using MimeKit;
using Microsoft.Extensions.Options;

public class EmailService
{
    private readonly EmailSettings _emailSettings;

    public EmailService(IOptions<EmailSettings> emailSettings)
    {
        _emailSettings = emailSettings.Value;
    }

    public async Task SendEmail(string subject, string body, List<string> recipients)
    {
        var email = new MimeMessage();

        email.From.Add(new MailboxAddress("Admin", _emailSettings.Email));

        foreach (var recipient in recipients)
        {
            email.To.Add(MailboxAddress.Parse(recipient));
        }

        email.Subject = subject;
        email.Body = new TextPart("plain")
        {
            Text = body
        };

        using var smtp = new SmtpClient();
        await smtp.ConnectAsync(_emailSettings.Host, _emailSettings.Port, false);
        await smtp.AuthenticateAsync(_emailSettings.Email, _emailSettings.AppPassword);
        await smtp.SendAsync(email);
        await smtp.DisconnectAsync(true);
    }
}