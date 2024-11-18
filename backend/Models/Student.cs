using System;
using System.Collections.Generic;

namespace backend.Models;

public partial class Student
{
    public Guid Id { get; set; }

    public string Firstname { get; set; } = null!;

    public string Surname { get; set; } = null!;

    public string? Patronymic { get; set; }

    public short Course { get; set; }

    public DateOnly Birthdate { get; set; }

    public string GroupName { get; set; } = null!;

    public virtual Group GroupNameNavigation { get; set; } = null!;

    public virtual ICollection<Mark> Marks { get; set; } = new List<Mark>();
}
