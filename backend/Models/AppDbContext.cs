using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace backend.Models;

public partial class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
	public virtual DbSet<Cabinet> Cabinets { get; set; } = null!;

    public virtual DbSet<Department> Departments { get; set; } = null!;

    public virtual DbSet<Discipline> Disciplines { get; set; } = null!;

    public virtual DbSet<DisciplineLog> DisciplineLogs { get; set; } = null!;

    public virtual DbSet<EventForm> EventForms { get; set; } = null!;

    public virtual DbSet<ExamDiscipline> ExamDisciplines { get; set; } = null!;

    public virtual DbSet<Group> Groups { get; set; } = null!;

    public virtual DbSet<Lecturer> Lecturers { get; set; } = null!;

    public virtual DbSet<Mark> Marks { get; set; } = null!;

    public virtual DbSet<Statement> Statements { get; set; } = null!;

    public virtual DbSet<Student> Students { get; set; } = null!;

    public virtual DbSet<VwLecturerDatum> VwLecturerData { get; set; } = null!;

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
// #warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see https://go.microsoft.com/fwlink/?LinkId=723263.
        => optionsBuilder.UseNpgsql("Server=localhost;Port=5432;Database=session_test;User Id=postgres;Password=postgres;");

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.HasPostgresExtension("pgcrypto");

        modelBuilder.Entity<Cabinet>(entity =>
        {
            entity.HasKey(e => e.RoomName).HasName("cabinet_pkey");

            entity.ToTable("cabinet");

            entity.Property(e => e.RoomName)
                .HasMaxLength(20)
                .HasColumnName("room_name");
        });

        modelBuilder.Entity<Department>(entity =>
        {
            entity.HasKey(e => e.Name).HasName("department_pkey");

            entity.ToTable("department", tb => tb.HasComment("Кафедра"));

            entity.Property(e => e.Name)
                .HasMaxLength(100)
                .HasColumnName("name");
        });

        modelBuilder.Entity<Discipline>(entity =>
        {
            entity.HasKey(e => e.Name).HasName("discipline_pkey");

            entity.ToTable("discipline");

            entity.Property(e => e.Name)
                .HasMaxLength(100)
                .HasColumnName("name");
        });

        modelBuilder.Entity<DisciplineLog>(entity =>
        {
            entity.HasKey(e => e.Discipline).HasName("discipline_log_pkey");

            entity.ToTable("discipline_log");

            entity.Property(e => e.Discipline)
                .HasMaxLength(100)
                .HasColumnName("discipline");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("now()")
                .HasColumnType("timestamp without time zone")
                .HasColumnName("created_at");
        });

        modelBuilder.Entity<EventForm>(entity =>
        {
            entity.HasKey(e => e.Type).HasName("event_form_pkey");

            entity.ToTable("event_form", tb => tb.HasComment("Форма проведения предмета"));

            entity.Property(e => e.Type)
                .HasMaxLength(20)
                .HasColumnName("type");
        });

        modelBuilder.Entity<ExamDiscipline>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("exam_discipline_pkey");

            entity.ToTable("exam_discipline", tb => tb.HasComment("Экзамеционная дисциплина"));

            entity.Property(e => e.Id)
                .HasDefaultValueSql("gen_random_uuid()")
                .HasColumnName("id");
            entity.Property(e => e.CabinetRoomName)
                .HasMaxLength(20)
                .HasColumnName("cabinet_room_name");
            entity.Property(e => e.DisciplineName)
                .HasMaxLength(100)
                .HasColumnName("discipline_name");
            entity.Property(e => e.EventDatetime)
                .HasColumnType("timestamp without time zone")
                .HasColumnName("event_datetime");
            entity.Property(e => e.EventFormType)
                .HasMaxLength(20)
                .HasColumnName("event_form_type");
            entity.Property(e => e.LecturerId).HasColumnName("lecturer_id");

            entity.HasOne(d => d.CabinetRoomNameNavigation).WithMany(p => p.ExamDisciplines)
                .HasForeignKey(d => d.CabinetRoomName)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("exam_discipline_cabinet_room_name_fkey");

            entity.HasOne(d => d.DisciplineNameNavigation).WithMany(p => p.ExamDisciplines)
                .HasForeignKey(d => d.DisciplineName)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("exam_discipline_discipline_name_fkey");

            entity.HasOne(d => d.EventFormTypeNavigation).WithMany(p => p.ExamDisciplines)
                .HasForeignKey(d => d.EventFormType)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("exam_discipline_event_form_id_fkey");

            entity.HasOne(d => d.Lecturer).WithMany(p => p.ExamDisciplines)
                .HasForeignKey(d => d.LecturerId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("exam_discipline_lecturer_id_fkey");
        });

        modelBuilder.Entity<Group>(entity =>
        {
            entity.HasKey(e => e.Name).HasName("group_pkey");

            entity.ToTable("group");

            entity.Property(e => e.Name)
                .HasMaxLength(100)
                .HasColumnName("name");
            entity.Property(e => e.DepartmentName)
                .HasMaxLength(100)
                .HasColumnName("department_name");

            entity.HasOne(d => d.DepartmentNameNavigation).WithMany(p => p.Groups)
                .HasForeignKey(d => d.DepartmentName)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("group_department_name_fkey");
        });

        modelBuilder.Entity<Lecturer>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("lecturer_pkey");

            entity.ToTable("lecturer", tb => tb.HasComment("Преподаватель"));

            entity.Property(e => e.Id)
                .HasDefaultValueSql("gen_random_uuid()")
                .HasColumnName("id");
            entity.Property(e => e.Birthdate).HasColumnName("birthdate");
            entity.Property(e => e.DepartmentName)
                .HasMaxLength(100)
                .HasColumnName("department_name");
            entity.Property(e => e.Firstname)
                .HasMaxLength(100)
                .HasColumnName("firstname");
            entity.Property(e => e.Patronymic)
                .HasMaxLength(100)
                .HasColumnName("patronymic");
            entity.Property(e => e.Surname)
                .HasMaxLength(100)
                .HasColumnName("surname");

            entity.HasOne(d => d.DepartmentNameNavigation).WithMany(p => p.Lecturers)
                .HasForeignKey(d => d.DepartmentName)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("lecturer_department_name_fkey");
        });

        modelBuilder.Entity<Mark>(entity =>
        {
            entity.HasKey(e => new { e.StudentId, e.StatementId }).HasName("mark_pkey");

            entity.ToTable("mark");

            entity.Property(e => e.StudentId).HasColumnName("student_id");
            entity.Property(e => e.StatementId).HasColumnName("statement_id");
            entity.Property(e => e.Mark1)
                .HasMaxLength(20)
                .HasColumnName("mark");

            entity.HasOne(d => d.Statement).WithMany(p => p.Marks)
                .HasForeignKey(d => d.StatementId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("mark_statement_id_fkey");

            entity.HasOne(d => d.Student).WithMany(p => p.Marks)
                .HasForeignKey(d => d.StudentId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("mark_student_id_fkey");
        });

        modelBuilder.Entity<Statement>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("statement_pkey");

            entity.ToTable("statement", tb => tb.HasComment("Ведомость"));

            entity.Property(e => e.Id)
                .HasDefaultValueSql("gen_random_uuid()")
                .HasColumnName("id");
            entity.Property(e => e.DateIssued).HasColumnName("date_issued");
            entity.Property(e => e.ExamDisciplineId).HasColumnName("exam_discipline_id");
            entity.Property(e => e.SessionYear).HasColumnName("session_year");

            entity.HasOne(d => d.ExamDiscipline).WithMany(p => p.Statements)
                .HasForeignKey(d => d.ExamDisciplineId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("statement_exam_discipline_id_fkey");
        });

        modelBuilder.Entity<Student>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("student_pkey");

            entity.ToTable("student");

            entity.Property(e => e.Id)
                .HasDefaultValueSql("gen_random_uuid()")
                .HasColumnName("id");
            entity.Property(e => e.Birthdate).HasColumnName("birthdate");
            entity.Property(e => e.Course).HasColumnName("course");
            entity.Property(e => e.Firstname)
                .HasMaxLength(100)
                .HasColumnName("firstname");
            entity.Property(e => e.GroupName)
                .HasMaxLength(100)
                .HasColumnName("group_name");
            entity.Property(e => e.Patronymic)
                .HasMaxLength(100)
                .HasColumnName("patronymic");
            entity.Property(e => e.Surname)
                .HasMaxLength(100)
                .HasColumnName("surname");

            entity.HasOne(d => d.GroupNameNavigation).WithMany(p => p.Students)
                .HasForeignKey(d => d.GroupName)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("student_group_name_fkey");
        });

        modelBuilder.Entity<VwLecturerDatum>(entity =>
        {
            entity
                .HasNoKey()
                .ToView("vw_lecturer_data");

            entity.Property(e => e.Кафедра).HasMaxLength(100);
            entity.Property(e => e.ФиоПреподавателя).HasColumnName("ФИО Преподавателя");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
