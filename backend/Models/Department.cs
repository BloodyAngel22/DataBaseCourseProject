using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace backend.Models;

/// <summary>
/// Кафедра
/// </summary>
public partial class Department
{
    public string Name { get; set; } = null!;

	[JsonIgnore]
    public virtual ICollection<Group> Groups { get; set; } = new List<Group>();

	[JsonIgnore]
    public virtual ICollection<Lecturer> Lecturers { get; set; } = new List<Lecturer>();
}
