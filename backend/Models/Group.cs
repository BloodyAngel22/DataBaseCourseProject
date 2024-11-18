using System;
using System.Collections.Generic;

namespace backend.Models;

public partial class Group
{
    public string Name { get; set; } = null!;

    public string DepartmentName { get; set; } = null!;

    public virtual Department DepartmentNameNavigation { get; set; } = null!;

    public virtual ICollection<Student> Students { get; set; } = new List<Student>();
}
