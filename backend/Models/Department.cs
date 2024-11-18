using System;
using System.Collections.Generic;

namespace backend.Models;

/// <summary>
/// Кафедра
/// </summary>
public partial class Department
{
    public string Name { get; set; } = null!;

    public virtual ICollection<Group> Groups { get; set; } = new List<Group>();

    public virtual ICollection<Lecturer> Lecturers { get; set; } = new List<Lecturer>();
}
