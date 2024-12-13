using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace backend.Models;

public partial class Group
{
    public string Name { get; set; } = null!;

    public string DepartmentName { get; set; } = null!;

	[JsonIgnore]
    public virtual Department DepartmentNameNavigation { get; set; } = null!;

	[JsonIgnore]
    public virtual ICollection<Student> Students { get; set; } = new List<Student>();
}
