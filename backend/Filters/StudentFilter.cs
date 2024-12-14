using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Filters
{
    public class StudentFilter
    {
		public string? DateStart { get; set; }
		public string? DateEnd { get; set; }
		public string? Course { get; set; }
		public string? GroupName { get; set; }
    }
}