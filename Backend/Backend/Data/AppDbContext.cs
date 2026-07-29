using Backend.Entities;
using Microsoft.EntityFrameworkCore;


namespace Backend.Data
{
    public class AppDbContext : DbContext
    {

        public AppDbContext(
            DbContextOptions<AppDbContext> options
        ) : base(options)
        {

        }


        public DbSet<User> Users { get; set; }

        public DbSet<ChatSession> ChatSessions { get; set; }

        public DbSet<ChatMessage> ChatMessages { get; set; }



        protected override void OnModelCreating(
            ModelBuilder modelBuilder
        )
        {

            base.OnModelCreating(modelBuilder);



            // User

            modelBuilder.Entity<User>()
                .HasKey(x => x.Id);


            modelBuilder.Entity<User>()
                .Property(x => x.Email)
                .IsRequired()
                .HasMaxLength(150);



            // User - ChatSession

            modelBuilder.Entity<User>()
                .HasMany(x => x.ChatSessions)
                .WithOne(x => x.User)
                .HasForeignKey(x => x.UserId)
                .OnDelete(DeleteBehavior.Cascade);



            // ChatSession

            modelBuilder.Entity<ChatSession>()
                .HasKey(x => x.Id);


            modelBuilder.Entity<ChatSession>()
                .Property(x => x.Title)
                .HasMaxLength(200);



            // ChatSession - ChatMessage

            modelBuilder.Entity<ChatSession>()
                .HasMany(x => x.Messages)
                .WithOne(x => x.ChatSession)
                .HasForeignKey(x => x.SessionId)
                .OnDelete(DeleteBehavior.Cascade);



            // ChatMessage

            modelBuilder.Entity<ChatMessage>()
                .HasKey(x => x.Id);


            modelBuilder.Entity<ChatMessage>()
                .Property(x => x.Role)
                .IsRequired()
                .HasMaxLength(50);


            modelBuilder.Entity<ChatMessage>()
                .Property(x => x.Content)
                .IsRequired();

        }
    }
}